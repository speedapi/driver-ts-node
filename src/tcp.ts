// SpeedAPI over TCP for Node.JS

import { BufferedLink } from "@speedapi/driver/transport/universal";
import { SpecSpaceGen, Session } from "@speedapi/driver";
import * as net from "net";

class TcpStream extends BufferedLink {
    socket: net.Socket;

    constructor(socket: net.Socket) {
        super();
        this.socket = socket;
        socket.on("data", (data: Buffer) => {
            this.dataArrived(data);
        });
        socket.on("close", () => {
            this.trigger({ type: "closed" });
        });
    }

    protected async dataWrite(data: Uint8Array): Promise<void> {
        return await new Promise((resolve, reject) => {
            this.socket.write(data, (err) => {
                if(err)
                    reject(err);
                else
                    resolve();
            });
        });
    }

    override async close(): Promise<void> {
        this.socket.destroy();
        this.trigger({ type: "closed" });
    }
}

export class TcpClient<Gen extends SpecSpaceGen> extends Session<Gen> {
    private readonly socket;

    constructor(specSpace: Gen, opts: net.NetConnectOpts) {
        const socket = net.connect(opts);
        const stream = new TcpStream(socket);

        super(specSpace, stream, "client");
        this.stream = stream;
        this.socket = socket;
    }

    override async stop() {
        await super.stop();
        this.socket.destroy();
    }
}

export class TcpServer<Gen extends SpecSpaceGen> extends Session<Gen> {
    private readonly socket;

    constructor(specSpace: Gen, socket: net.Socket) {
        super(specSpace, new TcpStream(socket), "server");
        this.socket = socket;
    }

    override async stop() {
        await super.stop();
        this.socket.destroy();
    }
}

export class TcpListener<Gen extends SpecSpaceGen> {
    private readonly server;

    constructor(specSpace: Gen, options: net.NetConnectOpts & { port: number, host?: string }, cb: (socket: TcpServer<Gen>) => void) {
        this.server = net.createServer(options, (socket) => {
            const session = new TcpServer(specSpace, socket);
            cb(session);
        });
        this.server.listen(options.port, options.host);
    }

    async close() {
        this.server.close();
    }
}
