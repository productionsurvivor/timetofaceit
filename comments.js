// Initialize Supabase
const SUPABASE_URL = "https://tolxsmutqtbpzxscqufr.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvbHhzbXV0cXRicHp4c2NxdWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwMDU1MjksImV4cCI6MjA1NjU4MTUyOX0.NGivuTx7iP3Rhw5EgEiBoJ514yvx9Fsf_RxqMLC-H98";
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Function to post a new message
async function postMessage(name, message) {
    if (!name || !message) {
        alert("Please enter both a name and a message.");
        return;
    }

    const { error } = await supabase
        .from("comments")
        .insert([{ name: name, message: message }]);

    if (error) {
        console.error("Error posting message:", error);
    } else {
        console.log("Message posted successfully!");
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
        messageElement.innerHTML = `<strong>${msg.name}:</strong> ${msg.message}`;
        messageContainer.appendChild(messageElement);
    });
}

// Load messages on page load
document.addEventListener("DOMContentLoaded", loadMessages);
