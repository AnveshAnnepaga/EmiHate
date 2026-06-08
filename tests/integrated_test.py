import requests
import json

BASE_URL = "http://127.0.0.1:7860/api"

def test_calibrated_sentiment():
    print("\n--- Testing Calibrated Sentiment (Neutral Check) ---")
    payload = {"text": "This is a normal sentence with no special emotion."}
    response = requests.post(f"{BASE_URL}/analyze/text", json=payload)
    data = response.json().get("data", {})
    final = data.get("analysis", {}).get("sentiment", {}).get("final_label")
    print(f"Input: {payload['text']}")
    print(f"Result: {final}")

def test_tweet_with_metadata():
    print("\n--- Testing Tweet with Metadata ---")
    payload = {"text": "I really think @johndoe is talking about #Election2024 again!"}
    response = requests.post(f"{BASE_URL}/analyze/tweet", json=payload)
    res_json = response.json()
    print(f"Mentions: {res_json.get('metadata', {}).get('mentions')}")
    print(f"Hashtags: {res_json.get('hashtags', {}).get('hashtags')}")
    print(f"Cleaned Text: {res_json.get('cleaned_text')}")

def test_conversation_trend():
    print("\n--- Testing Conversation Trend (Escalation) ---")
    payload = {
        "messages": [
            "Hello there!",
            "Stop talking to me, I don't like you.",
            "I hate everything about your existence, you are terrible!"
        ]
    }
    response = requests.post(f"{BASE_URL}/analyze/conversation", json=payload)
    data = response.json().get("data", {})
    print(f"Thread Count: {data.get('messages_analyzed')}")
    print(f"Toxicity Trend: {data.get('toxicity_trend')}")
    print(f"Avg Hate Score: {data.get('average_hate_score')}")

if __name__ == "__main__":
    try:
        test_calibrated_sentiment()
        test_tweet_with_metadata()
        test_conversation_trend()
    except Exception as e:
        print(f"Test Failed: {e}")
