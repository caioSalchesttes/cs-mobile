export default function ArticleRegistrationModal({ isModalOpen, toggleModal, handleRegisterArticle, titleRef, descriptionRef }) {
    return isModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg w-1/2">
                <h2 className="text-2xl mb-4">Register New Article</h2>
                <form onSubmit={handleRegisterArticle}>
                    <div className="mb-4">
                        <label className="block text-sm mb-2">Title</label>
                        <input type="text" className="w-full border p-2" required ref={titleRef} />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm mb-2">Description</label>
                        <textarea className="w-full border p-2" required ref={descriptionRef}></textarea>
                    </div>
                    <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md">
                        Register
                    </button>
                    <button type="button" className="ml-4" onClick={toggleModal}>
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    )
}
