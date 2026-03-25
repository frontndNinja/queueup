import type { VoteValue } from "@prisma/client";

type VoteLike = { value: VoteValue; };

export function calcVoteScore(votes: VoteLike[]): number {
    return votes.reduce((sum, v) => {
        switch (v.value) {
            case "LIKE":
                return sum + 1;
            case "SUPERLIKE":
                return sum + 3;
            case "DISLIKE":
                return sum - 1;
            default:
                return sum;
        }
    }, 0);
}