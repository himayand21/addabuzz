import React, {createContext, Component} from 'react';
import socketClient from 'socket.io-client';

const socket = socketClient();
export const SocketContext = createContext(socket);

export function withSocket(WrappedComponent) {
    return class WithSocket extends Component {
        render() {
            return (
                <SocketContext.Provider value={socket}>
                    <WrappedComponent {...this.props} />
                </SocketContext.Provider>
            );
        }
    };
}