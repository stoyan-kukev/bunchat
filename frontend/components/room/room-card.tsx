import type { Room } from "@/common/types";
import { useRoom } from "@/frontend/context/room-context";

export function RoomCard({ id, name }: Room) {
	const { room, setRoom } = useRoom()!;
	if (!room) return null;

	const handleClick = () => setRoom({ id, name });

	return (
		<div className="flex justify-between items-center bg-gray-700 p-4 rounded-lg shadow-md border border-gray-600 hover:bg-gray-600 transition">
			<div>
				<h2 className="text-lg font-semibold text-gray-300">#{name}</h2>
				<p className="text-gray-500 text-sm">ID: {id}</p>
			</div>
			<button
				onClick={handleClick}
				className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
			>
				Join
			</button>
		</div>
	);
}
