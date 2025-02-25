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
			setError("Room name must be longer than 2 charachters");
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
			className="fixed inset-0 flex items-center justify-center bg-black/50"
			onClick={() => setOpen(false)}
		>
			<div
				className="bg-gray-700 p-6 rounded-xl shadow-lg flex flex-col"
				onClick={handleContentClick}
			>
				<h1 className="text-2xl font-bold mb-4 text-white drop-shadow-xl">
					Create new chat room
				</h1>

				<div className="flex flex-col justify-center gap-y-2">
					<label htmlFor="name" className="text-white">
						Enter the chat room's name:
					</label>
					<input
						className="bg-gray-600 text-white px-2 py-1 rounded-md"
						type="text"
						id="name"
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
					{error && <p className="text-red-400">{error}</p>}
				</div>

				<div className="flex justify-between gap-x-6">
					<button
						onClick={() => setOpen(false)}
						className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded cursor-pointer"
					>
						Close
					</button>

					<button
						onClick={() => handleCreateRoom()}
						className="mt-4 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded cursor-pointer"
					>
						Create
					</button>
				</div>
			</div>
		</div>,
		document.body
	);
}
