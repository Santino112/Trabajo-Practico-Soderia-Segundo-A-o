export async function getBarrios() {
    try {
        const res = await fetch("http://localhost:4000/Barrio");
        const data = await res.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error("Error fetching clientes:", error);
    }
}