﻿using System;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using VocaDb.Model;
using VocaDb.Model.DataContracts;
using VocaDb.Model.DataContracts.ReleaseEvents;
using VocaDb.Model.DataContracts.Songs;
using VocaDb.Model.Domain;
using VocaDb.Model.Domain.Globalization;
using VocaDb.Model.Domain.Images;
using VocaDb.Model.Domain.ReleaseEvents;
using VocaDb.Model.Domain.Security;
using VocaDb.Web.Code;

namespace VocaDb.Web.Models.Event {

	[PropertyModelBinder]
	public class EventEdit : IEntryImageInformation {

		EntryType IEntryImageInformation.EntryType => EntryType.ReleaseEvent;
		string IEntryImageInformation.Mime => PictureMime;

		public EventEdit() {
			Description = SeriesSuffix = string.Empty;
		}

		public EventEdit(ReleaseEventSeriesContract seriesContract, IUserPermissionContext userContext)
			: this() {

			Series = seriesContract;

			AllowedEntryStatuses = EntryPermissionManager.AllowedEntryStatuses(userContext).ToArray();

		}

		public EventEdit(ReleaseEventForEditContract contract, IUserPermissionContext userContext)
			: this() {

			ParamIs.NotNull(() => contract);

			Category = contract.Category;
			CustomName = contract.CustomName = contract.CustomName;
			Date = contract.Date;
			DefaultNameLanguage = contract.DefaultNameLanguage;
			Description = contract.Description;
			Id = contract.Id;
			Name = OldName = contract.Name;
			Names = contract.Names;
			Series = contract.Series;
			SeriesNumber = contract.SeriesNumber;
			SeriesSuffix = contract.SeriesSuffix;
			SongList = contract.SongList;
			Status = contract.Status;
			Venue = contract.Venue;
			WebLinks = contract.WebLinks;

			CopyNonEditableProperties(contract, userContext);

		}

		public ReleaseEventSeriesContract[] AllSeries { get; set; }

		public EntryStatus[] AllowedEntryStatuses { get; set; }

		public EventCategory Category { get; set; }

		public bool CustomName { get; set; }

		[FromJson]
		public DateTime? Date { get; set; }

		public ContentLanguageSelection DefaultNameLanguage { get; set; }

		[StringLength(400)]
		public string Description { get; set; }

		public int Id { get; set; }

		[StringLength(50)]
		public string Name { get; set; }

		[FromJson]
		public LocalizedStringWithIdContract[] Names { get; set; }

		public string OldName { get; set; }

		public string PictureMime { get; set; }

		[FromJson]
		public ReleaseEventSeriesContract Series { get; set; }

		[Display(Name = "Series suffix")]
		public string SeriesSuffix { get; set; }

		[Display(Name = "Series number")]
		public int SeriesNumber { get; set; }

		[FromJson]
		public SongListBaseContract SongList { get; set; }

		public EntryStatus Status { get; set; }

		public string UrlSlug { get; set; }

		public string Venue { get; set; }

		public int Version { get; set; }

		[FromJson]
		public WebLinkContract[] WebLinks { get; set; }

		public void CopyNonEditableProperties(ReleaseEventDetailsContract contract, IUserPermissionContext userContext) {

			AllowedEntryStatuses = EntryPermissionManager.AllowedEntryStatuses(userContext).ToArray();

			if (contract != null) {
				OldName = contract.Name;
				PictureMime = contract.PictureMime;
				UrlSlug = contract.UrlSlug;
				Version = contract.Version;
			}

		}

		public ReleaseEventForEditContract ToContract() {

			return new ReleaseEventForEditContract {
				Category = Category,
				CustomName = this.CustomName,
				Date = this.Date,
				DefaultNameLanguage = DefaultNameLanguage,
				Description = this.Description ?? string.Empty,
				Id = this.Id,
				Name = this.Name,
				Names = Names,
				Series = this.Series, 
				SeriesNumber = this.SeriesNumber,
				SeriesSuffix = this.SeriesSuffix ?? string.Empty,
				SongList = SongList,
				Status = Status,
				Venue = Venue,
				WebLinks = this.WebLinks
			};

		}

	}

}