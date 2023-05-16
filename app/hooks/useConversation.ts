import { useParams } from "next/navigation";
import { useMemo } from "react";

const useConversation = () => {
	const params = useParams();

	const convId = useMemo(() => {
		if (!params?.convId) {
			return '';
		}

		return params.convId as string;
	}, [params?.convId]);

	const isOpen = useMemo(() => !!convId, [convId]);

	return useMemo(() => ({
		isOpen,
		convId
	}), [isOpen, convId]);
}

export default useConversation;