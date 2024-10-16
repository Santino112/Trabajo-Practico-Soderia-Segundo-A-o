export async function getProveedor() {
    try {
        const res = await fetch("http://localhost:4000/Proveedor");
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching pedidos:", error);
    }
}