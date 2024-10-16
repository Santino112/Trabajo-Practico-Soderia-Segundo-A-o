export async function getClientes() {
    try {
        const res = await fetch("http://localhost:4000/Cliente");
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching clientes:", error);
    }
}