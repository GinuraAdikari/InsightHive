import torch
import pandas as pd
from transformers import AutoModelForTokenClassification, AutoTokenizer
from transformers import BertTokenizer, BertForSequenceClassification
import string
from collections import defaultdict
from fuzzywuzzy import fuzz
from nltk.sentiment import SentimentIntensityAnalyzer
import re
import nltk
from nltk.corpus import stopwords
nltk.download('vader_lexicon')
nltk.download('stopwords')

stop_words = set(stopwords.words("english"))


# Load ATE model and tokenizer
ate_model_path = "./models/absa_model/roberta_ate_model"
ate_tokenizer_path = "./models/absa_model/roberta_tokenizer"
ate_model = AutoModelForTokenClassification.from_pretrained(ate_model_path)
ate_tokenizer = AutoTokenizer.from_pretrained(ate_tokenizer_path, add_prefix_space=True)
ate_model.eval()

# Load ABSC model and tokenizer
absc_model_path = "./models/absa_model/bert_absc_model"
absc_tokenizer_path = "./models/absa_model/bert_absc_tokenizer"
absc_model = BertForSequenceClassification.from_pretrained(absc_model_path)
absc_tokenizer = BertTokenizer.from_pretrained(absc_tokenizer_path)
absc_model.eval()

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
ate_model.to(device)
absc_model.to(device)

PREDEFINED_ASPECTS = [
    "price", "service", "quality", "delivery", "usability",
    "item", "product", "performance", "support", "refunds",
    "food", "speed", "packaging", "customer service", "value"
]

FUZZY_THRESHOLD = 70

def extract_aspects(text):
    inputs = ate_tokenizer(text, return_tensors="pt", truncation=True, padding=True).to(device)
    with torch.no_grad():
        logits = ate_model(**inputs).logits
    predictions = torch.argmax(logits, dim=2).squeeze().tolist()
    tokens = ate_tokenizer.convert_ids_to_tokens(inputs["input_ids"].squeeze())

    aspect_terms = []
    current = []
    for token, label in zip(tokens, predictions):
        if token in string.punctuation:
            continue
        if label == 1:
            if current:
                aspect_terms.append(" ".join(current))
                current = []
            current.append(token.replace("Ġ", ""))
        elif label == 2 and current:
            current.append(token.replace("Ġ", ""))
        else:
            if current:
                aspect_terms.append(" ".join(current))
                current = []
    if current:
        aspect_terms.append(" ".join(current))

    return aspect_terms

def clean_extracted_aspects(aspect_terms):
    cleaned = []
    for term in aspect_terms:
        if term in ["<s>", "</s>"]:
            continue
        # Join broken tokens like "Ref und s"
        term = term.replace("Ġ", "")
        # Remove non-alphabetic or very short words
        term = re.sub(r'[^a-zA-Z\s]', '', term)
        words = term.split()
        words = [w for w in words if w.lower() not in stop_words and len(w) > 1]
        if words:
            cleaned.append(" ".join(words))
    return cleaned

def predict_sentiment(review, aspect):
    encoding = absc_tokenizer(review, aspect, return_tensors="pt", truncation=True, padding=True, max_length=128).to(device)
    with torch.no_grad():
        logits = absc_model(**encoding).logits
    probs = torch.nn.functional.softmax(logits, dim=1).squeeze()
    print(f"\n→ Raw Logits: {logits}")
    print(f"→ Probabilities: {probs}")
    positive_score = probs[1].item()
    negative_score = probs[0].item()
    return positive_score * 100, negative_score * 100

def match_aspect_term(aspect_term, predefined_list, fuzzy_threshold=80):
    aspect_clean = aspect_term.lower().strip()
    tokens = aspect_clean.split()

    # 1. Direct keyword match (high priority)
    for target in predefined_list:
        if target in aspect_clean:
            return target, 100  # perfect match

    # 2. Token-level check (e.g., ignore "the", "this", short tokens)
    if len(tokens) < 2:
        return None, 0  # skip very short/ambiguous terms

    # 3. Improved fuzzy matching
    best_match = None
    best_score = 0
    for target in predefined_list:
        score = fuzz.token_set_ratio(aspect_clean, target.lower())
        if score > best_score:
            best_match = target
            best_score = score

    if best_score >= fuzzy_threshold:
        return best_match, best_score

    return None, 0  # no reliable match

def run_absa_pipeline(df):
    all_results = defaultdict(lambda: {"positive": 0, "negative": 0, "count": 0})

    for _, row in df.iterrows():
        text = row["review"]
        aspects = extract_aspects(text)
        aspects = clean_extracted_aspects(aspects)

        print(f"\n=== REVIEW: {text}")
        print(f"Extracted aspects: {aspects}")

        for aspect in aspects:
            matched, score = match_aspect_term(aspect, PREDEFINED_ASPECTS)
            if matched:
                pos, neg = predict_sentiment(text, aspect)
                print(f"  → Matched Aspect: {aspect} -> {matched} (score: {score})")
                print(f"    Sentiment: +{pos:.2f} / -{neg:.2f}")
                all_results[matched]["positive"] += pos
                all_results[matched]["negative"] += neg
                all_results[matched]["count"] += 1

    final_results = []
    for aspect, values in all_results.items():
        count = values["count"]
        final_results.append({
            "aspect": aspect,
            "positive": round(values["positive"] / count, 2),
            "negative": round(values["negative"] / count, 2)
        })

    print("\n=== Final Aggregated Results ===")
    for r in final_results:
        print(r)

    return final_results

def run_vader_pipeline(df):
    print("===> Running VADER (Fast) pipeline")
    sia = SentimentIntensityAnalyzer()

    results = {aspect: {"positive": 0, "negative": 0, "count": 0} for aspect in PREDEFINED_ASPECTS}

    for _, row in df.iterrows():
        text = row["review"]
        text_lower = text.lower()

        for aspect in PREDEFINED_ASPECTS:
            if aspect in text_lower:
                score = sia.polarity_scores(text)
                print(f"\n→ VADER score for aspect '{aspect}' in review:\n{text}\n→ {score}")

                if score["compound"] > 0.05:
                    results[aspect]["positive"] += 1
                elif score["compound"] < -0.05:
                    results[aspect]["negative"] += 1

                results[aspect]["count"] += 1

    final_results = []
    for aspect, data in results.items():
        if data["count"] == 0:
            continue
        final_results.append({
            "aspect": aspect,
            "positive": round((data["positive"] / data["count"]) * 100, 2),
            "negative": round((data["negative"] / data["count"]) * 100, 2)
        })

    print("\n=== Final VADER Aggregated Results ===")
    for r in final_results:
        print(r)

    return final_results