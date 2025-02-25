import type { Room } from "@/types";
import { useRoom } from "@/context/room-context";

export function RoomCard({ id, name }: Room) {
	const { room, setRoom } = useRoom()!;
	if (room) return null;

	const handleClick = () => setRoom({ id, name });

	return (
		<div className="glass-lighter p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border border-white/5">
			<div className="flex justify-between items-center">
				<div>
					<h2 className="text-lg font-semibold text-white">{name}</h2>
					<p className="text-indigo-300 text-xs">ID: {id}</p>
				</div>
				<button
					onClick={handleClick}
					className="bg-gradient-accent hover:opacity-90 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
				>
					Join
				</button>
			</div>
		</div>
	);
}
