import google.generativeai as genai

genai.configure(api_key="YOUR_API_KEY")  # or use GOOGLE_API_KEY env var

model = genai.GenerativeModel("gemini-1.5-flash")
resp = model.generate_content("Say 'Hello from Gemini!' in 3 words.")
print(resp.text)
