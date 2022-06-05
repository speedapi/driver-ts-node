// SpeedAPI over WebSocket for Node.JS

import { BufferedLink } from "@speedapi/driver/transport/universal";
import { SpecSpaceGen, Session } from "@speedapi/driver";
import * as ws from "ws";

class WsStream extends BufferedLink {
    socket: ws.WebSocket;

    constructor(socket: ws.WebSocket) {
        super();
        this.socket = socket;
        socket.on("message", (data: Buffer, isBinary) => {
            if(isBinary)
                this.dataArrived(data);
        });
        socket.on("close", () => {
            this.trigger({ type: "closed" });
        });
    }

    protected async dataWrite(data: Uint8Array): Promise<void> {
        if(this.socket.readyState !== this.socket.OPEN)
            await new Promise((res) => this.socket.once("open", res));

        return await new Promise((resolve, reject) => {
            this.socket.send(data, (err) => {
                if(err)
                    reject(err);
                else
                    resolve();
            });
        });
    }

    override async close(): Promise<void> {
        this.socket.close();
        this.trigger({ type: "closed" });
    }
}

export class WsClient<Gen extends SpecSpaceGen> extends Session<Gen> {
    private readonly socket;

    constructor(specSpace: Gen, url: string, opts?: ws.ClientOptions) {
        const socket = new ws.WebSocket(url, ["speedapi"], opts);
        const stream = new WsStream(socket);

        super(specSpace, stream, "client");
        this.stream = stream;
        this.socket = socket;
    }

    override async stop() {
        await super.stop();
        this.socket.close();
    }
}

export class WsServer<Gen extends SpecSpaceGen> extends Session<Gen> {
    private readonly socket;

    constructor(specSpace: Gen, socket: ws.WebSocket) {
        super(specSpace, new WsStream(socket), "server");
        this.socket = socket;
    }

    override async stop() {
        await super.stop();
        this.socket.close();
    }
}

export class WsListener<Gen extends SpecSpaceGen> {
    private readonly server;

    constructor(specSpace: Gen, options: ws.ServerOptions, cb: (socket: WsServer<Gen>) => void) {
        this.server = new ws.WebSocketServer(options);
        this.server.on("connection", (socket) => {
            const session = new WsServer(specSpace, socket);
            cb(session);
        });
    }

    async close() {
        this.server.close();
    }
}
