export async function getProductos() {
    try {
        const res = await fetch("http://localhost:4000/Producto");
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching pedidos:", error);
    }
}