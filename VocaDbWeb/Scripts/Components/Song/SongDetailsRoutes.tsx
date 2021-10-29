import SongDetailsForApi from '@DataContracts/Song/SongDetailsForApi';
import EntryUrlMapper from '@Shared/EntryUrlMapper';
import SongDetailsStore from '@Stores/Song/SongDetailsStore';
import classNames from 'classnames';
import _ from 'lodash';
import qs from 'qs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Route, Routes } from 'react-router-dom';

import { userLanguageCultures } from '../Shared/Partials/Knockout/DropdownList';
import SongBasicInfo from './SongBasicInfo';
import SongDiscussion from './SongDiscussion';
import SongLyrics from './SongLyrics';
import SongRelated from './SongRelated';
import SongShare from './SongShare';

interface SongDetailsNavItemProps {
	active: boolean;
	href: string;
	children?: React.ReactNode;
}

const SongDetailsNavItem = React.memo(
	({ active, href, children }: SongDetailsNavItemProps): React.ReactElement => {
		const [hover, setHover] = React.useState(false);

		return (
			<li
				className={classNames(
					'ui-state-default',
					'ui-corner-top',
					active && ['ui-tabs-active', 'ui-state-active'],
					hover && 'ui-state-hover',
				)}
				onMouseEnter={(): void => setHover(true)}
				onMouseLeave={(): void => setHover(false)}
			>
				<Link to={href} className="ui-tabs-anchor" role="presentation">
					{children}
				</Link>
			</li>
		);
	},
);

interface SongDetailsTabsProps {
	model: SongDetailsForApi;
	songDetailsStore: SongDetailsStore;
	tab: 'basicInfo' | 'lyrics' | 'discussion' | 'related' | 'share';
	children?: React.ReactNode;
}

export const SongDetailsTabs = React.memo(
	({
		model,
		songDetailsStore,
		tab,
		children,
	}: SongDetailsTabsProps): React.ReactElement => {
		const { t } = useTranslation([
			'ViewRes',
			'ViewRes.Song',
			'VocaDb.Web.Resources.Domain.Globalization',
		]);

		const lyricsLanguageNames = _.chain(model.lyrics)
			.sortBy((l) => l.translationType)
			.filter((l) => !!l.cultureCode || l!.translationType === 'Romanized')
			.map((l) =>
				l.translationType !== 'Romanized'
					? userLanguageCultures[l.cultureCode!].nativeName
					: t(
							'VocaDb.Web.Resources.Domain.Globalization:TranslationTypeNames.Romanized',
					  ),
			)
			.take(3)
			.value();

		const additionalLyrics =
			lyricsLanguageNames.length > 0
				? model.lyrics.length - lyricsLanguageNames.length
				: 0;

		const lyricsLanguages =
			lyricsLanguageNames.length > 0
				? `(${lyricsLanguageNames.join(', ')}${
						additionalLyrics > 0
							? ` ${t('ViewRes.Song:Details.LyricsPlusOthers', {
									0: additionalLyrics,
							  })}`
							: ''
				  })`
				: '';

		return (
			<div className="js-cloak ui-tabs ui-widget ui-widget-content ui-corner-all">
				<ul
					className="ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all"
					role="tablist"
				>
					<SongDetailsNavItem
						active={tab === 'basicInfo'}
						href={`${EntryUrlMapper.details_song(model.contract.song)}`}
					>
						{t('ViewRes:EntryDetails.BasicInfoTab')}
					</SongDetailsNavItem>
					{model.lyrics.length > 0 && (
						<SongDetailsNavItem
							active={tab === 'lyrics'}
							href={`${EntryUrlMapper.details_song(
								model.contract.song,
							)}/lyrics?${qs.stringify({
								lyricsId: songDetailsStore.selectedLyricsId,
							})}`}
						>
							{t('ViewRes.Song:Details.Lyrics')} {lyricsLanguages}
						</SongDetailsNavItem>
					)}
					<SongDetailsNavItem
						active={tab === 'discussion'}
						href={`${EntryUrlMapper.details_song(
							model.contract.song,
						)}/discussion`}
					>
						{t('ViewRes:EntryDetails.DiscussionTab')} ({model.commentCount})
					</SongDetailsNavItem>
					<SongDetailsNavItem
						active={tab === 'related'}
						href={`${EntryUrlMapper.details_song(model.contract.song)}/related`}
					>
						{t('ViewRes.Song:Details.RelatedSongs')}
					</SongDetailsNavItem>
					<SongDetailsNavItem
						active={tab === 'share'}
						href={`${EntryUrlMapper.details_song(model.contract.song)}/share`}
					>
						{t('ViewRes.Song:Details.Share')}
					</SongDetailsNavItem>
				</ul>

				<div
					className="ui-tabs-panel ui-widget-content ui-corner-bottom"
					role="tabpanel"
				>
					{children}
				</div>
			</div>
		);
	},
);

interface SongDetailsRoutesProps {
	model: SongDetailsForApi;
	songDetailsStore: SongDetailsStore;
}

const SongDetailsRoutes = ({
	model,
	songDetailsStore,
}: SongDetailsRoutesProps): React.ReactElement => {
	return (
		<Routes>
			<Route
				path="lyrics"
				element={
					<SongLyrics model={model} songDetailsStore={songDetailsStore} />
				}
			/>
			<Route
				path="discussion"
				element={
					<SongDiscussion model={model} songDetailsStore={songDetailsStore} />
				}
			/>
			<Route
				path="related"
				element={
					<SongRelated model={model} songDetailsStore={songDetailsStore} />
				}
			/>
			<Route
				path="share"
				element={
					<SongShare model={model} songDetailsStore={songDetailsStore} />
				}
			/>
			<Route
				path="*"
				element={
					<SongBasicInfo model={model} songDetailsStore={songDetailsStore} />
				}
			/>
		</Routes>
	);
};

export default SongDetailsRoutes;
