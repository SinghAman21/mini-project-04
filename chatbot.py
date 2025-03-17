import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure Gemini API
GOOGLE_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GOOGLE_API_KEY)

# Set up the model
model = genai.GenerativeModel('gemini-pro')

def initialize_chat():
    return model.start_chat(history=[])

def get_response(chat, user_input):
    try:
        response = chat.send_message(user_input)
        return response.text
    except Exception as e:
        return f"An error occurred: {str(e)}"

def main():
    print("🤖 Welcome to Gemini Chatbot!")
    print("Type 'quit' or 'exit' to end the conversation.")
    
    # Initialize chat
    chat = initialize_chat()
    
    while True:
        # Get user input
        user_input = input("\nYou: ").strip()
        
        # Check if user wants to quit
        if user_input.lower() in ['quit', 'exit']:
            print("\nGoodbye! Have a great day! 👋")
            break
        
        # Get chatbot response
        print("\nChatbot: ", end="")
        response = get_response(chat, user_input)
        print(response)

if __name__ == "__main__":
    main() 