// Ensure the script runs after the page is fully loaded
document.addEventListener("DOMContentLoaded", function () {
    // Initialize Supabase
    const SUPABASE_URL = "https://tolxsmutqtbpzxscqufr.supabase.co"; // Replace with your actual Supabase URL
    const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvbHhzbXV0cXRicHp4c2NxdWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwMDU1MjksImV4cCI6MjA1NjU4MTUyOX0.NGivuTx7iP3Rhw5EgEiBoJ514yvx9Fsf_RxqMLC-H98"; // Replace with your actual Supabase Anonymous Key
    const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // Function to post a new message
    async function postMessage() {
        const nameInput = document.getElementById("name");
        const messageInput = document.getElementById("message");

        const name = nameInput.value.trim();
        const message = messageInput.value.trim();

        if (!name || !message) {
            alert("Please enter both a name and a message.");
            return;
        }

        const { error } = await supabase
            .from("comments")
            .insert([{ name, message }]);

        if (error) {
            console.error("Error posting message:", error);
        } else {
            console.log("Message posted successfully!");
            nameInput.value = ""; // Clear input fields
            messageInput.value = "";
            loadMessages(); // Refresh messages
        }
    }

    // Function to load messages from Supabase
    async function loadMessages() {
        const { data, error } = await supabase
            .from("comments")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error loading messages:", error);
            return;
        }

        const messageContainer = document.getElementById("messages");
        messageContainer.innerHTML = ""; // Clear previous messages

        data.forEach((msg) => {
            const messageElement = document.createElement("p");
            messageElement.innerHTML = `<strong>${msg.name}</strong>: ${msg.message}`;
            messageContainer.appendChild(messageElement);
        });
    }

    // Attach postMessage function to button click
    document.getElementById("postButton").addEventListener("click", postMessage);

    // Load messages when the page loads
    loadMessages();
});
