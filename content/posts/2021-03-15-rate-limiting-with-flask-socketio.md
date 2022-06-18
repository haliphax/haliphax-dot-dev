---
title: "Rate limiting with Flask-SocketIO"
tags: ['post', 'python', 'my-software', 'flask', 'socket-io', 'websockets']
layout: post
---

I've been transitioning the API for a [Flask] project I'm working on away from
REST and toward [Socket.IO]. In doing so, I came to the abrupt and depressing
realization that the rate-limiter I had been using for the REST endpoints
([flask-limiter]) was unable to apply to Socket.IO endpoints. The author of
[Flask-SocketIO] himself suggests that you roll your own solution. Since there
seemed to be no package for handling this, I did just that.

The code below defines a decorator, `limit_socketio`, which can be passed
arguments for the key to use for calculating rates and limits (in case you
want several endpoints to share the same key as a resource pool), the window of
time to consider, and the allowed number of requests from a particular user
in that window of time. Since this is a decorator with arguments, even if you
are not providing arguments, you must still use parentheses:

```python
@socketio.on('some_event')
@limit_socketio(key='my_key', window=60, allowance=10)
def func1():
	print('10 per minute')

@socketio.on('other_event')
@limit_socketio()
def func2():
	print('Default rate limit and key')
```

The default rate limit is 2 requests per second, and the default key prefix
is `socketio`. While the code uses [Redis], it would be trivial to replace this
dependency with some other storage mechanism. Likewise, the dependency on
[flask-login] could be swapped out with some other mechanism for uniquely
identifying the user.

```python
"Socket.IO limiter"

# stdlib
from functools import wraps
from typing import Callable
# 3rd party
import redis
# local
from . import app

r = redis.Redis(app.config['REDIS_HOST'])


def limit_socketio(key: str = 'socketio', window: int = 1,
                   allowance: int = 2) -> Callable:
    """
    Rate-limiter for Socket.IO event handlers.

    :param key: The key (prefix) of the redis object for tracking request rate
    :param window: Length (in seconds) of the window
    :param allowance: How many requests to allow within the window
    """

    def wrapper(f: Callable):
        from flask_login import current_user

        @wraps(f)
        def func(*args, **kwargs):
            rkey = f'{key}.{current_user.id}'
            u = r.get(rkey)

            if u is None:
                r.setex(rkey, 1, window)
                u = 1
            else:
                u = r.incr(rkey)

            if u > allowance:
                app.logger.debug(f'Rate-limiting {current_user.username}')

                return None

            return f(*args, **kwargs)

        return func

    return wrapper
```

While I am only using this for Socket.IO rate-limiting, the code actually
has nothing to do with sockets. It could just as easily be used for rate
limiting _any_ function execution within a variety of contexts. The "rate
limit" action here is effectively a no-op, whereas you may want to disconnect
the offending user, instead (which _would_ make this particular to web
sockets).


[flask-limiter]: https://pypi.org/project/Flask-Limiter/
[flask-login]: https://pypi.org/project/Flask-Login/
[Flask-SocketIO]: https://pypi.org/project/Flask-SocketIO/
[Flask]: https://flask.palletsprojects.com
[Redis]: https://redis.io
[Socket.IO]: https://socket.io
