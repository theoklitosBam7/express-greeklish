# express-greeklish

A simple express.js api that transforms greeklish to greek via URL Parameters. It also performs spell check where it is possible.

```
GET http://localhost:7070/api/greeklish?text=Euhxo: auto pou akougetai wraia.
```

```
GET http://localhost:7070/api/greeklish?text=Euhxo: autw pou akougetai wrea.
```

```
{
    "greek": "Εύηχο: αυτό που ακούγεται ωραία."
}
```

## Usage

- `git clone https://github.com/theoklitosBam7/express-greeklish.git`
- `cd express-greeklish`
- `npm install`
- `npm start`
