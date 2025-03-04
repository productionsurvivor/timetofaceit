
   // Ensure script runs after the page fully loads
document.addEventListener("DOMContentLoaded", function () {
    console.log("Initializing Supabase...");

    // ✅ Replace these with your actual Supabase credentials
    const SUPABASE_URL = "https://txlsmutqbtzpzscuafjr.supabase.co";  // Replace with your Supabase URL
    const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvbHhzbXV0cXRicHp4c2NxdWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwMDU1MjksImV4cCI6MjA1NjU4MTUyOX0.NGivuTx7iP3Rhw5EgEiBoJ514yvx9Fsf_RxqMLC-H98";  // Replace with your Supabase key

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        console.error("Supabase credentials are missing.");
        return;
    }

    // ✅ Make sure the Supabase client is created once and globally available
    window.supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log("Supabase Initialized", window.supabase);

    // ✅ Ensure the button exists before adding an event listener
    const postButton = document.getElementById("postButton");
    if (postButton) {
        postButton.addEventListener("click", postMessage);
    } else {
        console.error("Post button not found.");
    }

    // ✅ Load messages when the page loads
    loadMessages();
});

// ✅ Function to post a message
async function postMessage() {
    const nameInput = document.getElementById("name");
    const messageInput = document.getElementById("message");

    if (!nameInput || !messageInput) {
        console.error("Input elements missing.");
        return;
    }

    const name = nameInput.value.trim();
    const message = messageInput.value.trim();

    if (!name || !message) {
        alert("Please enter both a name and a message.");
        return;
    }

    const { error } = await window.supabase
        .from("comments")
        .insert([{ name, message }]);

    if (error) {
        console.error("Error posting message:", error);
    } else {
        console.log("Message posted successfully!");
        nameInput.value = "";
        messageInput.value = "";
        loadMessages(); // Refresh messages
    }
}

// ✅ Function to load messages
async function loadMessages() {
    const { data, error } = await window.supabase
        .from("comments")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error loading messages:", error);
        return;
    }

    const messageContainer = document.getElementById("messages");
    if (!messageContainer) {
        console.error("Message container not found.");
        return;
    }

    messageContainer.innerHTML = ""; // Clear previous messages

    data.forEach((msg) => {
        const messageElement = document.createElement("p");
        messageElement.innerHTML = `<strong>${msg.name}:</strong> ${msg.message}`;
        messageContainer.appendChild(messageElement);
    });
}
