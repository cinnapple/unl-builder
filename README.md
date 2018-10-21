# Unique Node List Builder

Unique Node List Builder is a web app that generates a hand-made Unique Node List for the [XRP Ledger](https://github.com/ripple/rippled) with the user's favorite validators. The app provides an easy-to-use wizard-ish user interface for a publisher to generate a JSON-formatted Unique Node List.

## What is UNL?

From FAQ [What are Unique Node Lists (UNLs)?](https://developers.ripple.com/technical-faq.html)

> They are the lists of transaction validators a given participant believes will not conspire to defraud them.

Each validating node in the XRP Ledger network listens to a set of other validators for accepting transaction proposals. The list of such validators is called **Unique Node List** and consists of well-known, trusted validators. Currently there is a default list provided by Ripple (Ripple's recommended unique node list) which is hosted at [https://vl.ripple.com](https://vl.ripple.com). The XRP Ledger node adopts this recommended UNL by default if no configuration change is made.

## The structure of UNL

```JSON
{
    "version": 1,
    "public_key": "ED81C7117B88914C57175ED410...",
    "signature": "66D81D7E875F5B5C75E1598BF37...",
    "manifest": "JAAAAAFxIe2BxxF7iJFMVxde1BAH...",
    "blob": "eyJleHBpcmF0a...."
}
```

| Property     | Descritpion                                                                                                            |
| :----------- | :--------------------------------------------------------------------------------------------------------------------- |
| `manifest`   | a publisher's information such as master public key, signing public key, and sequence.                                 |
| `version`    | the version of the UNL.                                                                                                |
| `public_key` | the publisher's master key used to verify the author (publisher) of the UNL is valid against what's in the `manifest`. |
| `blob`       | a base64-encoded list of validators                                                                                    |
| `signature`  | a digital signature created by signing the `blob` value with the publisher's `signing private key`                     |

## Motivation

From FAQ [If Ripple recommends adoption of its UNL, doesn’t that create a centralized system?](https://developers.ripple.com/technical-faq.html)

> The XRP Ledger network is opt-in. Each participant directly or indirectly chooses its UNL. Should Ripple stop operating or should Ripple act maliciously, participants could change their UNLs to continue using the XRP Ledger.

We all know that it is highly unlikely that Ripple would engage in a malicious activity that devastates the XRP Ledger network, but I believe it is crucial for everyone in the XRP Ledger community to be able to choose validators and build a UNL by its own without relying on Ripple. Furthermore, Ripple plans to ultimately remove itself from the process in the near future...

> ...Currently, Ripple provides a default and recommended list which we expand based on watching the history of validators operated by Ripple and third parties. Eventually, Ripple intends to remove itself from this process entirely by having network participants select their own lists based on publicly available data about validator quality.

...so eventually the community would take a reponsiblity for doing what Ripple does today, and I'm hoping that this experimental app could be of help.
