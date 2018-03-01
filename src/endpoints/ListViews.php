<?php

namespace Directus\Api\Routes;

use Directus\Application\Application;
use Directus\Application\Http\Request;
use Directus\Application\Http\Response;
use Directus\Application\Route;
use Directus\Services\ListViewsService;

class ListViews extends Route
{
    /**
     * @param Application $app
     */
    public function __invoke(Application $app)
    {
        create_ping_route($app);

        $app->get('', [$this, 'all']);
    }

    public function all(Request $request, Response $response)
    {
        $service = new ListViewsService($this->container);
        $responseData = $service->findAll();

        return $this->responseWithData($request, $response, $responseData);
    }
}