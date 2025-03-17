import streamlit as st
import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure page settings
st.set_page_config(
    page_title="Gemini AI Chatbot",
    page_icon="🤖",
    layout="centered"
)

# Custom CSS for better UI
st.markdown("""
<style>
.stApp {
    max-width: 800px;
    margin: 0 auto;
}
.chat-message {
    padding: 1.5rem;
    border-radius: 0.5rem;
    margin-bottom: 1rem;
    display: flex;
    flex-direction: column;
}
.user-message {
    background-color: #e6f3ff;
}
.bot-message {
    background-color: #f0f2f6;
}
.message-content {
    display: flex;
    align-items: flex-start;
}
.avatar {
    margin-right: 1rem;
    font-size: 1.5rem;
}
</style>
""", unsafe_allow_html=True)

# Initialize Gemini API
GOOGLE_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel('gemini-pro')

# Initialize session state for chat history
if "chat" not in st.session_state:
    st.session_state.chat = model.start_chat(history=[])
if "messages" not in st.session_state:
    st.session_state.messages = []

# Chat title
st.title("🤖 Gemini AI Chatbot")
st.markdown("---")

# Display chat messages
for message in st.session_state.messages:
    role = message["role"]
    content = message["content"]
    
    with st.container():
        if role == "user":
            st.markdown(f"""
            <div class="chat-message user-message">
                <div class="message-content">
                    <div class="avatar">👤</div>
                    <div>{content}</div>
                </div>
            </div>
            """, unsafe_allow_html=True)
        else:
            st.markdown(f"""
            <div class="chat-message bot-message">
                <div class="message-content">
                    <div class="avatar">🤖</div>
                    <div>{content}</div>
                </div>
            </div>
            """, unsafe_allow_html=True)

# Chat input
with st.container():
    user_input = st.chat_input("Type your message here...")
    
    if user_input:
        # Add user message to chat history
        st.session_state.messages.append({"role": "user", "content": user_input})
        
        try:
            # Get response from Gemini
            response = st.session_state.chat.send_message(user_input)
            bot_response = response.text
            
            # Add bot response to chat history
            st.session_state.messages.append({"role": "assistant", "content": bot_response})
            
            # Rerun to update the chat display
            st.rerun()
            
        except Exception as e:
            st.error(f"An error occurred: {str(e)}")

# Clear chat button
if st.sidebar.button("Clear Chat"):
    st.session_state.messages = []
    st.session_state.chat = model.start_chat(history=[])
    st.rerun()

# Sidebar information
with st.sidebar:
    st.markdown("### About")
    st.markdown("""
    This chatbot is powered by Google's Gemini AI model. 
    You can ask questions, have conversations, or get help with various tasks.
    
    **Features:**
    - 💬 Natural conversation
    - 📝 Chat history
    - 🔄 Clear chat option
    """)
    
    st.markdown("---")
    st.markdown("### Tips")
    st.markdown("""
    - Be specific in your questions
    - You can ask follow-up questions
    - Clear the chat to start fresh
    """) 