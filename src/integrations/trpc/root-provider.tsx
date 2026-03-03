// src/integrations/trpc/root-provider.tsx

import { useQueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useState } from "react";
import { getTRPCClient, trpc } from "#/lib/trpc";

export default function TRPCProvider({ children }: { children: ReactNode }) {
	const queryClient = useQueryClient();
	const [trpcClient] = useState(() => getTRPCClient());

	return (
		<trpc.Provider client={trpcClient} queryClient={queryClient}>
			{children}
		</trpc.Provider>
	);
}
