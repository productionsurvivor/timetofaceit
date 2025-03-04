   // Ensure script only runs after the page loads
document.addEventListener("DOMContentLoaded", async function () {
    console.log("Initializing Supabase...");

    // Initialize Supabase Client
    const SUPABASE_URL = "https://txlsmutqbtzpzscuafjr.supabase.co"; // Replace with your actual Supabase URL
    const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvbHhzbXV0cXRicHp4c2NxdWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwMDU1MjksImV4cCI6MjA1NjU4MTUyOX0.NGivuTx7iP3Rhw5EgEiBoJ514yvx9Fsf_RxqMLC-H98"; // Replace with your actual Supabase Anonymous Key

    const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log("Supabase Initialized!");

    // Attach event listener to post button
    document.getElementById("postButton").addEventListener("click", async function () {
        await postMessage(supabase);
    });

    // Load messages on page load
    await loadMessages(supabase);
});

// Function to post a new message
async function postMessage(supabase) {
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
        await loadMessages(supabase); // Refresh messages
    }
}

// Function to load messages from Supabase
async function loadMessages(supabase) {
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

    data.forEach(msg => {
        const messageElement = document.createElement("p");
        messageElement.innerHTML = `<strong>${msg.name}:</strong> ${msg.message}`;
        messageContainer.appendChild(messageElement);
    });
}
