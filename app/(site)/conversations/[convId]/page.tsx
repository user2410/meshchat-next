import getConversationById from "@/app/actions/getConversationById";
import getMessages from "@/app/actions/getMessages";
import { EmptyState } from "@/app/components/EmptyState";
import Body from "@/app/components/conversations/[convId]/Body";
import Form from "@/app/components/conversations/[convId]/Form";
import Header from "@/app/components/conversations/[convId]/Header";

interface IParams {
	convId: string;
}

const ConvId = async ({ params }: { params: IParams }) => {
	const conversation = await getConversationById(params.convId);
	const messages = await getMessages(params.convId);

	if (!conversation) {
		return (
			<div className="lg:pl-80 h-full">
				<div className="h-full flex flex-col">
					<EmptyState />
				</div>
			</div>
		);
	}

	return (
		<div className="lg:pl-80 h-full">
			<div className="h-full flex flex-col">
				<Header conversation={conversation} />
				<Body initialMessages={messages} />
				<Form />
			</div>
		</div>
	);
};

export default ConvId;
