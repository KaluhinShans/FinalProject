package com;

import com.DTO.UserDTO;
import com.entity.User;
import io.vertx.core.AbstractVerticle;
import io.vertx.core.Future;
import io.vertx.core.http.HttpClient;
import io.vertx.core.http.HttpClientOptions;
import io.vertx.core.http.HttpClientRequest;
import io.vertx.core.json.Json;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.RoutingContext;
import io.vertx.ext.web.handler.BodyHandler;
import io.vertx.ext.web.handler.StaticHandler;


public class RestVerticle extends AbstractVerticle {


    @Override
    public void start(Future<Void> future) throws Exception {
        Router router = Router.router(vertx);

        router.route("/*").handler(StaticHandler.create("web//SiteForm"));
        router.post("/*").handler(BodyHandler.create());

        router.post("/register").handler(this::registerUser);
        router.post("/login").handler(this::loginUser);
        router.post("/getData").handler(this::getData);
        router.post("/setRelay").handler(this::setRelay);

        vertx.createHttpServer()
                .requestHandler(router::accept)
                .listen(config().getInteger("http.port", 9090),
                        result -> {
                            if (result.succeeded()) {
                                future.complete();
                            } else {
                                future.fail(result.cause());
                            }
                        });
    }

    private void registerUser(RoutingContext routingContext) {
        String name = routingContext.getBodyAsJson().getString("name");
        String password = routingContext.getBodyAsJson().getString("password");
        String email = routingContext.getBodyAsJson().getString("email");

        User user = new User(name, password, email);
        UserDTO userDTO = new UserDTO();
        userDTO.saveUser(user);

        routingContext.response()
                .putHeader("content-type", "application/json")
                .setStatusCode(200)
                .end(Json.encodePrettily(true));
    }

    private void loginUser(RoutingContext routingContext) {
        String email = routingContext.getBodyAsJson().getString("email");
        String password = routingContext.getBodyAsJson().getString("password");

        UserDTO userDTO = new UserDTO();
        boolean userRegister = userDTO.isUserRegister(email, password);
        if (userRegister) {
            routingContext.response()
                    .putHeader("content-type", "text/html")
                    .putHeader("resultLogin", "You have account")
                    .end();
        } else {
            routingContext.response()
                    .putHeader("content-type", "text/html")
                    .putHeader("resultLogin", "Nope")
                    .end();
        }
    }


    private void getData(RoutingContext routingContext) {
        String link = routingContext.getBodyAsJson().getString("link");
        String password = routingContext.getBodyAsJson().getString("password");

        HttpClientOptions options = new HttpClientOptions();
        options.setDefaultHost(link);
        options.setDefaultPort(1488);

        HttpClient client = vertx.createHttpClient(options);

        HttpClientRequest request = client.get("/", response -> {
            System.out.println("Received response with status code " + response.statusCode());
            response.bodyHandler(ar -> {
                JsonObject json = ar.toJsonObject();
                routingContext.response()
                        .putHeader("content-type", "application/json")
                        .putHeader("temperature", json.getString("temperature"))
                        .putHeader("humidity", json.getString("humidity"))
                        .putHeader("time", json.getString("time"))
                        .putHeader("IsRelayOpen", json.getString("IsRelayOpen"))
                        .putHeader("isWaterOnFlow", json.getString("isWaterOnFlow"))
                        .setStatusCode(200)
                        .end(Json.encodePrettily(true));
            });
        });
        request.putHeader("password", password);
        request.end();
    }

    private void setRelay(RoutingContext routingContext) {
        String link = routingContext.getBodyAsJson().getString("link");
        String status = routingContext.getBodyAsJson().getString("status");

        HttpClientOptions options = new HttpClientOptions();
        options.setDefaultHost(link);
        options.setDefaultPort(1488);
        System.out.println("http://"+link+":1488"+"/setRelayState?state="+status);
        HttpClient client = vertx.createHttpClient(options);
        HttpClientRequest request = client.get("/setRelayState?state=" + status, httpClientResponse ->
                System.out.println("Received response with status code " + httpClientResponse.statusCode()));
        request.end();
    }
}
