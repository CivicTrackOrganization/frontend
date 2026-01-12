import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createVote, deleteVote, patchVote } from "../services/voteService";
import toast from "react-hot-toast";

export const useReportVotes = (reportId: number) => {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["reports"] });
    queryClient.invalidateQueries({ queryKey: ["myReports"] });
    queryClient.invalidateQueries({ queryKey: ["report", reportId] });
  };

  const createVoteMutation = useMutation({
    mutationFn: ({ vote }: { vote: number }) => createVote(reportId, vote),
    onSuccess: invalidate,
    onError: () => toast.error("Failed to create vote"),
  });

  const deleteVoteMutation = useMutation({
    mutationFn: () => deleteVote(reportId),
    onSuccess: invalidate,
    onError: () => toast.error("Failed to remove vote"),
  });

  const patchVoteMutation = useMutation({
    mutationFn: ({ vote }: { vote: number }) => patchVote(reportId, vote),
    onSuccess: invalidate,
    onError: () => toast.error("Failed to create vote"),
  });

  const isPending =
    createVoteMutation.isPending ||
    deleteVoteMutation.isPending ||
    patchVoteMutation.isPending;

  const handleVoteAction = (
    currentVoteType: number | null,
    targetVoteType: number
  ) => {
    if (isPending) return;

    if (currentVoteType === targetVoteType) {
      deleteVoteMutation.mutate();
    } else if (currentVoteType != null) {
      patchVoteMutation.mutate({ vote: targetVoteType });
    } else {
      createVoteMutation.mutate({ vote: targetVoteType });
    }
  };

  return { handleVoteAction, isPending };
};
