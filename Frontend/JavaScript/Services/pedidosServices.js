export async function getPedidos() {
    try {
        const res = await fetch("http://localhost:4000/Pedido");
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching pedidos:", error);
    }
}
