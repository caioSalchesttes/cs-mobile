export default function Header() {
    return (
        <header className="bg-blue-500 text-white py-4">
            <div className="container mx-auto flex justify-between items-center">
                <a href="#" className="text-2xl font-semibold">SmartCare</a>
                <nav>
                    <ul className="flex space-x-4">
                        <li><a href="#" className="hover:text-gray-300">Home</a></li>
                    </ul>
                </nav>
            </div>
        </header>
    )
}
