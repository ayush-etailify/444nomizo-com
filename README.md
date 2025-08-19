# Etailify Storefront Starter

Structure:

```
/app
/lib
    utils
    types
    data
    ui
/modules
    layout
    products
```

```
- auth and protection
- accounts
    - login
    - order history
    - address history
    - account basic details
- api sdk
- recheck cart logic
    - upsert cart after login
    - items added to cart (when logged out), but logged in later.
- revist module based structure
- revisit client/server component separation
    - ISR
- make other abstractions
- lp
- route/page config
- search

- filters, reviews, discounts
```

7411307692
123456

const cart = JSON.parse(localStorage.cartStore2)
