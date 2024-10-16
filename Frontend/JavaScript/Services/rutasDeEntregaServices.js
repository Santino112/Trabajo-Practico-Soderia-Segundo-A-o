export async function getRutaEntrega() {
    try {
        const res = await fetch("http://localhost:4000/Recorrido");
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching pedidos:", error);
    }
}