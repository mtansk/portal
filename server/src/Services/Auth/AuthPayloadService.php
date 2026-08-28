<?php
namespace Mtansk\Cp\Services\Auth;

class AuthPayloadService
{
    private TokenService $tokenService;
    private AccessStateService $accessStateService;

    public function __construct(
        TokenService $tokenService,
        AccessStateService $accessStateService
    ) {
        $this->tokenService = $tokenService;
        $this->accessStateService = $accessStateService;
    }


    public function getAuthorizationPayload(string $userId): array
    {
        $accessState = $this->accessStateService->getCachedAccessState($userId);
        $tokens = $this->tokenService->generateTokensPair($userId);

        return array_merge($tokens, $accessState);
    }

}