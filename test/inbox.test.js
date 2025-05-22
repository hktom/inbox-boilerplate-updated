const assert = require("assert");
const { Web3 } = require("web3");
const ganache = require("ganache");

const web3 = new Web3(ganache.provider());

const { abi, evm } = require("../compiler");

let accounts;
let inbox;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  inbox = await new web3.eth.Contract(abi)
    .deploy({
      data: evm.bytecode.object,
      arguments: ["Hi There"],
    })
    .send({ from: accounts[0], gas: "1000000" });
});

describe("Inbox", () => {
  it("should deploy the contract", async () => {
    assert.ok(inbox.options.address);
  });

  it("has a default message", async () => {
    const message = await inbox.methods.message().call();
    assert.equal(message, "Hi There");
  });

  it("can change the message", async () => {
    await inbox.methods.setMessage("bye").send({ from: accounts[0] });
    const message = await inbox.methods.message().call();
    assert.equal(message, "bye");
  });
});
