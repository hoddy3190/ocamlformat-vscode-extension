import * as assert from "assert";
import * as cmd from "../../cmd";

describe("cmd", function () {
  describe("#execOnShell", function () {
    describe('#execOnShell("undefined_shell_cmd")', function () {
      it("should return StatusError when the command is not undefined", function () {
        assert.equal(
          cmd.execOnShell("undefined_shell_cmd").error?.kind,
          "StatusError"
        );
      });
    });

    describe('#execOnShell("echo -n sample")', function () {
      it('should return "-n sample\n" because default shell is sh', function () {
        assert.equal(cmd.execOnShell("echo -n sample").stdout, "-n sample\n");
      });
    });

    describe('#execOnShell("/bin/echo -n sample")', function () {
      it('should return "sample" because default shell is sh but /bin/echo is outer command', function () {
        assert.equal(cmd.execOnShell("/bin/echo -n sample").stdout, "sample");
      });
    });

    describe('#execOnShell("/bin/echo -n")', function () {
      it("should return empty string", function () {
        assert.equal(cmd.execOnShell("/bin/echo -n").stdout, "");
      });
    });
  });

  describe("#exec", function () {
    describe('#exec("undefined_shell_cmd")', function () {
      it("should return ExecError when the command is not undefined", function () {
        assert.equal(cmd.exec("undefined_shell_cmd").error?.kind, "ExecError");
      });
    });

    describe('#exec("echo -n sample")', function () {
      it('should return "sample"', function () {
        assert.equal(cmd.exec("echo", ["-n", "sample"]).stdout, "sample");
      });
    });

    describe('#exec("/bin/echo -n sample")', function () {
      it('should return "sample"', function () {
        assert.equal(cmd.exec("/bin/echo", ["-n", "sample"]).stdout, "sample");
      });
    });

    describe('#exec("seq -u")', function () {
      it("should return StatusError when the option is illegal", function () {
        assert.equal(cmd.exec("seq", ["-u"]).error?.kind, "StatusError");
      });
    });
  });
});
