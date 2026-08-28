using System.Collections.Generic;
using System.IO;
using System.Threading;
using System.Threading.Tasks;

namespace LexAudit.Application.Interfaces;

public interface IPdfExtractor
{
    (bool isText, int pageCount) ExtractHeuristics(Stream pdfStream);
    Task<List<string>> ExtractParagraphsAsync(Stream fileStream, CancellationToken ct);
}
