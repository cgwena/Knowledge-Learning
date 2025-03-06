import { describe, it } from "mocha";
import { expect } from "chai";
import sinon from "sinon";
import createCheckoutSession from "../services/stripe.js";

describe("Stripe createCheckoutSession", () => {
  let stripeMock;

  beforeEach(() => {
    stripeMock = {
      checkout: {
        sessions: {
          create: sinon.stub().resolves({
            url: "https://fake-checkout-session.url",
          }),
        },
      },
    };
  });

  it("should create a checkout session and return the session URL", async () => {
    const fakeOrderId = "order123";
    const fakeProducts = [{ title: "Produit Test", price: 49.99 }];

    const sessionUrl = await createCheckoutSession(
      fakeOrderId,
      fakeProducts,
      stripeMock
    );

    expect(sessionUrl).to.equal("https://fake-checkout-session.url");
    expect(stripeMock.checkout.sessions.create.calledOnce).to.be.true;
  });
});

it("should throw an error if product is invalid", async () => {
  const fakeOrderId = "order123";
  const fakeProducts = [
    { title: "Produit incomplet" }, // Pas de price
  ];

  const stripeMock = {
    checkout: {
      sessions: {
        create: sinon.stub(),
      },
    },
  };

  try {
    await createCheckoutSession(fakeOrderId, fakeProducts, stripeMock);
    throw new Error("Test failed, error was not thrown");
  } catch (error) {
    expect(error.message).to.equal(
      "Erreur lors de la création de la session Stripe."
    );
  }

  expect(stripeMock.checkout.sessions.create.notCalled).to.be.true;
});
