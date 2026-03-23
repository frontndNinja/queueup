export default function Pill({ text, color }: { text: string, color: string; }) {

    const formatText = (text: string) => {
        return text.charAt(0).toUpperCase() + text.slice(1);
    };


    return (
        <div className={`flex items-center justify-center px-2 py-1 h-fit w-fit rounded-full text-xs font-bold 
        ${color === "blue" ? "bg-blue-600 text-white" :
                color === "green" ? "bg-green-600 text-white" :
                    color === "red" ? "bg-red-600 text-white" :
                        color === "yellow" ? "bg-yellow-400 text-black" :
                            color === "purple" ? "bg-purple-600 text-white" :
                                color === "orange" ? "bg-orange-600 text-white" :
                                    color === "dark" ? "bg-accent text-white" :
                                        color === "light" ? "bg-primary text-white" :
                                            "bg-gray-200 text-black"}`}>
            <p>{formatText(text)}</p>
        </div>
    );
}