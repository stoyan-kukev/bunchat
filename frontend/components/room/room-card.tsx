import type { Room } from "../../../types";
import { useRoom } from "./room-context";

export function RoomCard({ id, name }: Room) {
	const roomContext = useRoom();
	if (!roomContext || roomContext.room) return;

	const { setRoom } = roomContext;
	const handleClick = () => {
		setRoom({ id, name });
	};

	return (
		<div className="px-8 py-4 flex justify-between items-center">
			<div className="flex gap-x-2">
				<h2>{name}</h2>
				<p className="text-gray-500">({id})</p>
			</div>
			<button
				onClick={handleClick}
				className="bg-green-500 hover:bg-green-600 text-white rounded-xl px-4 py-2 hover:cursor-pointer"
			>
				Join
			</button>
		</div>
	);
}
