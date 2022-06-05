import * as speedapi from "@speedapi/driver";
import { TcpClient, TcpListener } from "../src/index";
import * as api from "./test_output/ts";

function delay(ms: number) {
    return new Promise((res) => setTimeout(res, ms));
}

describe("TCP", () => {
    test("global method call", async () => {
        let closed = false;
        // set up a server
        const listener = new TcpListener(api.$specSpace, {
            port: 1234,
        }, (session) => {
            const server = new speedapi.Server(session, { });

            server.onInvocation("say_hi", async (method, _state) => {
                await method.return({ greeting: `Hello, ${method.params.name}!` });
            });
            server.onClose((_state) => {
                closed = true;
            });
        });

        // create client
        const client = api.$bind(new TcpClient(api.$specSpace, {
            host: "localhost",
            port: 1234,
        }));

        // call say_hi()
        const { greeting } = await client.sayHi({ name: "Jest" });
        expect(greeting).toBe("Hello, Jest!");

        // close
        await client.$close();
        await delay(200);
        expect(closed).toBe(true);
        await listener.close();
    });
});
