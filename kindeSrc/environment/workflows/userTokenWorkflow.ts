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
    console.log("Workflow triggered for user:", event.context.user.id);

    const accessToken = accessTokenCustomClaims<{
        test: string;
    }>();

    accessToken.test = "Hello World";
}
