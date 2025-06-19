import {
    onUserTokenGeneratedEvent,
    accessTokenCustomClaims,
    WorkflowSettings,
    WorkflowTrigger,
    createKindeAPI
} from "@kinde/infrastructure";

// The setting for this workflow
export const workflowSettings: WorkflowSettings = {
    id: "onUserTokenGeneration",
    trigger: WorkflowTrigger.UserTokenGeneration,
    failurePolicy: {
        action: "stop",
    },
    bindings: {
        "kinde.accessToken": {}, // required to modify access token claims
        "kinde.fetch": {}, // Required for external API calls
        "kinde.env": {}, // required to access your environment variables
        "kinde.mfa": {}, // required to access MFA status
        url: {}, // required for url params
    },
};

export default async function Workflow(event: onUserTokenGeneratedEvent) {
    try {
        const kindeAPI = await createKindeAPI(event);
        const userId = event.context.user.id;
        const { data: user } = await kindeAPI.get({
            endpoint: `user?id=${userId}`,
        });
        const orgCodes = user.organizations || [];

        // Add organizations array to access token
        const accessToken = accessTokenCustomClaims<{
            org_codes: string[];
        }>();

        // Set the organizations array in the access token
        accessToken.org_codes = orgCodes;

        console.log(`Added ${orgCodes.length} organizations to access token for user ${event.context.user.id}`);

    } catch (error) {
        console.error("Failed to add organizations to access token:", error);
    }
}
