# Centrifuge v3 API back-end wrapper

This is a node module for interacting with the centrifugo(v3) through back-end API.

Documentation for centrifugo(v3) is available [here](https://centrifugal.dev).

---

### Installation

`npm install @shaitan-masters/centrifugo`

`yarn add @shaitan-masters/centrifugo`

---

### Usage

#### Base

```typescript
import {Centrifuge, CentrifugeError} from '@shaitan-masters/centrifugo';


const centrifuge = new Centrifuge({
	endpoint: 'http://locahost:8000',
	token   : 'adminToken123'
});

try {
	const publish = await centrifuge.publish('channel01', {hello: 'moto'});

	console.log(publish);
	// { epoch: 'Wds32', offset: 3 }
} catch (error) {
	if (error instanceof CentrifugeError) {
		const errorData = error.data;

		console.log(errorData);
		// { code: 42, message: 'some error message' };    
	}
}
```

##### Methods

###### publish(channel: string, data: Payload)

```typescript
const publish = await centrifuge.publish('channel01', {hello: 'moto'});

//  { 
//      epoch: 'Wds32', 
//      offset: 3 
//  } 
```

###### broadcast(channel: string, data: Payload)

```typescript
const broadcast = await centrifuge.broadcast('channel01', {hello: 'moto'});

//  { 
//      responses: [
//          { epoch: 'Wds32', offset: 3 },
//          { epoch: 'FwaW1', offset: 1 }
//      ] 
//  }
```

###### presence(channel: string)

```typescript
const presence = await centrifuge.presence('channel01');

//  { 
//      presence: {
//          '0e35a387-86a0-4ed1-823f-81b6e1d2e55b': {
//              user: '42',
//              client: '0e35a387-86a0-4ed1-823f-81b6e1d2e55b'
//          }
//      }        
//  } 
```

###### presenceStats(channel: string)

```typescript
const presenceStats = await centrifuge.presenceStats('channel01');

//  { 
//      num_clients: 4
//      num_users: 2     
//  }
```

###### history(channel: string, limit: number = 0)

```typescript
const history = await centrifuge.history('channel01');

// { 
//      publications: [
//          {
//              data: { 
//                  hello: 'moto'
//              },
//              offset: 3
//          },
//          {
//              data: { 
//                  hello: 'moto'
//              },
//              offset: 5
//          }
//      ]      
//  }
```

###### historyRemove(channel: string)

```typescript
const presenceStats = await centrifuge.presenceStats('channel01');

//  {}
```

###### channels(pattern: string = '')

```typescript
const channels = await centrifuge.channels();

//  {
//      channels: {
//          channel01: {
//              num_clients: 2
//          }
//      }
//  }
```

###### subscribe(channel: string, user: string)

```typescript
const subscribe = await centrifuge.subscribe('channel01', '42');

//  {}
```

###### unsubscribe(channel: string, user: string)

```typescript
const unsubscribe = await centrifuge.unsubscribe('channel01', '42');

//  {}
```

###### disconnect(user: string)

```typescript
const disconnect = await centrifuge.disconnect('42');

//  {}
```

###### refresh(user: string, client: string, exprireAt: number)

```typescript
const refresh = await centrifuge.refresh('42', '0e35a387-86a0-4ed1-823f-81b6e1d2e55b', 3600);

//  {}
```

###### info()

```typescript
const info = await centrifuge.info();

//  huge info object
```

###### healthCheck()

```typescript
const health = await centrifuge.healthCheck();

// true/false
```


