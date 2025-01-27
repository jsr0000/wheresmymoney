export default function DataConsent({ onAccept, onDecline }) {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[#232323] p-8 rounded-lg max-w-md">
                <h2 className="text-2xl font-bold mb-4">Data Storage Consent</h2>
                <p className="mb-6 text-gray-300">
                    We store your asset data securely to provide you with a better experience.
                    Your data is encrypted and you can request deletion at any time.
                    Do you consent to data storage?
                </p>
                <div className="flex gap-4">
                    <button
                        onClick={onAccept}
                        className="flex-1 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                        Accept
                    </button>
                    <button
                        onClick={onDecline}
                        className="flex-1 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                        Decline
                    </button>
                </div>
            </div>
        </div>
    );
} 