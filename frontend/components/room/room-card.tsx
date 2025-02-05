interface Props {
	id: string;
	name: string;
}

export function RoomCard({ id, name }: Props) {
	return (
		<div className="px-8 py-4 flex justify-between items-center">
			<div className="flex gap-x-2">
				<h2>{name}</h2>
				<p className="text-gray-500">({id})</p>
			</div>
			<button className="bg-green-500 hover:bg-green-600 text-white rounded-xl px-4 py-2 hover:cursor-pointer">
				Join
			</button>
		</div>
	);
}
