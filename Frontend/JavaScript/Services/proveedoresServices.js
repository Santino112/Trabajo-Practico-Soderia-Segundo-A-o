export async function getBarrio() {
    try {
        const res = await fetch("http://localhost:4000/Barrio/Cliente");
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching pedidos:", error);
    }
}