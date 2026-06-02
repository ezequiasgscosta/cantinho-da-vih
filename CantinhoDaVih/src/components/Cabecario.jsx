import logo from "../assets/perfil.png"
function Cabecario() {
    return (
        <div className="
bg-gradient-to-r from-pink-400 to-purple-500 flex items-center justify-around width-full p-4
">
            <div><img className="w-14" src={logo} alt="Logo do Cantinho da Vih" width="200" /></div>
            <div>
                <h1 className="text-3xl font-bold text-white">Cantinho Da Vih</h1>
            </div>
            
        </div>
    );
};

export default Cabecario