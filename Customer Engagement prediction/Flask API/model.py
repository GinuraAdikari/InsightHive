import torch
import torch.nn.functional as F
from torch_geometric.nn import HeteroConv, SAGEConv
from torch.optim.lr_scheduler import StepLR


device = torch.device("cuda" if torch.cuda.is_available() else "cpu")


class HeteroGCN(torch.nn.Module):
    def __init__(self, hidden_dim, num_layers=3):  # Dynamic num_layers
        super().__init__()

        # Define the relations once to avoid repetition
        self.relations = [
            ('campaign', 'hosted_on', 'platform'),
            ('platform', 'rev_hosted_on', 'campaign'),
            ('campaign', 'uses', 'channel'),
            ('channel', 'rev_uses', 'campaign'),
            ('platform', 'supports', 'channel'),
            ('campaign', 'uses', 'creative'),
            ('creative', 'rev_uses', 'campaign'),
            ('creative', 'designed_with', 'template'),
            ('campaign', 'associated_with', 'keywords'),
            ('keywords', 'rev_associated_with', 'campaign'),
            ('campaign', 'managed_by', 'network'),
            ('platform', 'optimized_for', 'keywords'),
            ('campaign', 'belongs_to', 'advertiser'),
            ('campaign', 'targeted_with', 'search_tag'),
            ('search_tag', 'rev_targeted_with', 'campaign'),
            ('campaign', 'targeted_in', 'region'),
            ('campaign', 'uses', 'currency')
        ]

        # Create HeteroConv layers dynamically
        self.convs = torch.nn.ModuleList([
            HeteroConv({rel: SAGEConv((-1, -1), hidden_dim) for rel in self.relations}, aggr="mean")
            for _ in range(num_layers)
        ])

        # LayerNorms for stability
        self.norms = torch.nn.ModuleList([torch.nn.LayerNorm(hidden_dim) for _ in range(num_layers)])

        # Fully connected layer for classification
        self.fc = torch.nn.Linear(hidden_dim * 11, 1)

    def forward(self, x_dict, edge_index_dict):
        for conv, norm in zip(self.convs, self.norms):
            x_dict = conv(x_dict, edge_index_dict)
            x_dict = {key: norm(F.leaky_relu(x, negative_slope=0.01)) for key, x in x_dict.items()}

        # Concatenate the features for classification
        x_combined = torch.cat([
            x_dict['campaign'], x_dict['platform'], x_dict['channel'], x_dict['creative'],
            x_dict['keywords'], x_dict['search_tag'], x_dict['advertiser'], x_dict['network'],
            x_dict['template'], x_dict['region'], x_dict['currency']
        ], dim=1)

        # Pass through the fully connected layer
        out = self.fc(x_combined)

        return torch.sigmoid(out).squeeze(-1)  # Sigmoid for binary classification
