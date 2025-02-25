import React, { useState } from "react";
import ReactDOM from "react-dom";

interface CreateRoomModalProps {
	open: boolean;
	setOpen: (open: boolean) => void;
	onSuccess: () => void;
}

export function CreateRoomModal({
	open,
	setOpen,
	onSuccess,
}: CreateRoomModalProps) {
	if (!open) return null;

	const [name, setName] = useState("");
	const [error, setError] = useState<string | null>(null);

	const handleContentClick = (e: React.MouseEvent) => {
		e.stopPropagation();
	};

	const handleCreateRoom = async () => {
		setError(null);

		if (name.length < 2) {
			setError("Room name must be longer than 2 characters");
			return;
		}

		const response = await fetch("/api/rooms/create", {
			credentials: "include",
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ name }),
		});

		if (response.status == 409) {
			setError("Room name already taken");
			return;
		}

		if (response.status != 200) {
			throw new Error("Something is very wrong");
		}

		onSuccess();
		setOpen(false);
	};

	return ReactDOM.createPortal(
		<div
			className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
			onClick={() => setOpen(false)}
		>
			<div
				className="glass rounded-xl shadow-lg flex flex-col w-full max-w-md p-6 animate-fade-in"
				onClick={handleContentClick}
			>
				<h1 className="text-2xl font-bold mb-6 text-white">
					Create new chat room
				</h1>

				<div className="flex flex-col justify-center gap-y-4">
					<label htmlFor="name" className="text-white font-medium">
						Enter the chat room's name:
					</label>
					<input
						className="glass-lighter text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
						type="text"
						id="name"
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder="Room name"
					/>
					{error && <p className="text-red-400 text-sm">{error}</p>}
				</div>

				<div className="flex justify-end gap-x-4 mt-6">
					<button
						onClick={() => setOpen(false)}
						className="px-4 py-2 glass-lighter hover:bg-gray-700/50 text-white rounded-lg transition-colors duration-200"
					>
						Cancel
					</button>

					<button
						onClick={() => handleCreateRoom()}
						className="px-4 py-2 bg-gradient-accent hover:opacity-90 text-white rounded-lg transition-all duration-200"
					>
						Create Room
					</button>
				</div>
			</div>
		</div>,
		document.body
	);
}
