import DataLoader from 'dataloader'
import { Upvote } from '../entities/Upvote'
import { User } from '../entities/User'

interface VoteTypeCondition {
	postId: number
	userId: number
}

// [1, 2]
// users === [{id: 1}, {id: 2}]
// FALSE: users === [{id: 2}, {id: 1}]
const batchGetUsers = async (userIds: number[]) => {
	const users = await User.findByIds(userIds)
	return userIds.map(userId => users.find(user => user.id === userId))
}

// SELECT * FROM Upvote WHERE [postId, userId] IN ([[19, 1], [18, 1], [17, 1]])

const batchGetVoteTypes = async (voteTypeConditions: VoteTypeCondition[]) => {
	const voteTypes = await Upvote.findByIds(voteTypeConditions)
	return voteTypeConditions.map(voteTypeCondition =>
		voteTypes.find(
			voteType =>
				voteType.postId === voteTypeCondition.postId &&
				voteType.userId === voteTypeCondition.userId
		)
	)
}

export const buildDataLoaders = () => ({
	userLoader: new DataLoader<number, User | undefined>(userIds =>
		batchGetUsers(userIds as number[])
	),
	voteTypeLoader: new DataLoader<VoteTypeCondition, Upvote | undefined>(
		voteTypeConditions =>
			batchGetVoteTypes(voteTypeConditions as VoteTypeCondition[])
	)
})
