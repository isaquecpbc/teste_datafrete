# Desenvolvimento de Lista de Itens em React + PHP.
Pequena aplicação REST API com laravel 10 e FRONTEND com React consumindo a api;


### para iniciar o React:


1. na raiz do projeto, ``` $ cd test-app ```
2. ``` $ npm install ```
3. ``` $ npm start ```

### Teste o acesso do app em http://localhost:3000/


### Para iniciar o laravel com o docker:


1. na raiz do projeto, ``` $ cd test-api ```
2. na pasta do projeto 'test-api' renomeie o arquivo ".env.example" para ".env", 
3. ``` $ docker-compose up -d ```
4. ``` $ docker-compose exec datafrete_api bash ```
5. ``` $ composer update ```
6. ``` $ php artisan key:generate ```
7. ``` $ php artisan optimize:clear ```


#### Para popular o banco de dados (opcional):

```
$ docker-compose exec datafrete_api bash 
```

```
php artisan migrate:fresh --seed
```

### Teste o acesso da api em http://localhost/


## Esta disponível o arquivo para api no postman na raiz do projeto!